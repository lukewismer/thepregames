#!/usr/bin/env python3

import pandas as pd
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import commonplayerinfo, teaminfocommon
import firebase_admin
from firebase_admin import credentials, firestore
from retry import retry
import requests
from requests.exceptions import RequestException
import time

team_cache = {}

def convert_birthdate_to_age(birthdate):
    if pd.isnull(birthdate):
        return None
    today = pd.Timestamp.today()
    birthdate = pd.to_datetime(birthdate.split("T")[0])
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

@retry(RequestException, tries=3, delay=1, backoff=2)
def get_player_info(player_id):
    return commonplayerinfo.CommonPlayerInfo(player_id=player_id).get_data_frames()[0]

@retry(RequestException, tries=3, delay=1, backoff=2)
def get_team_info(team_id):
    if team_id in team_cache:
        print(f"Using cached team info for team ID: {team_id}")
        return team_cache[team_id]
    
    print(f"Fetching team info for team ID: {team_id}")
    team_df = teaminfocommon.TeamInfoCommon(team_id=team_id).get_data_frames()[0]
    
    team_cache[team_id] = team_df
    return team_df

def main():
    cred = credentials.Certificate("/Users/lukewismer/Library/Mobile Documents/com~apple~CloudDocs/thepregames/api/sports_data/serviceAccount.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    
    active_players = [p for p in players.get_players() if p['is_active']]
    
    player_data = []
    for player in active_players:
        player_id = player['id']
        print(f"Processing player: {player_id} - {player['full_name']}")
        
        try:
            player_df = get_player_info(player_id)
        except Exception as e:
            print(f"Failed to get player {player_id}: {str(e)}")
            continue

        if player_df.empty:
            print(f"No data found for player {player_id}")
            continue

        player_info = player_df.iloc[0]
        team_id = player_info.TEAM_ID
        
        if team_id:
            try:
                team_df = get_team_info(team_id)
            except Exception as e:
                print(f"Failed to get team {team_id}: {str(e)}")
                continue

            if team_df.empty:
                print(f"No data found for team {team_id}")
                continue

            team_info = team_df.iloc[0]
            conference = team_info['TEAM_CONFERENCE']
            division = team_info['TEAM_DIVISION']
        
        if conference == 'East':
            conference = 'Eastern'
        elif conference == 'West':
            conference = 'Western'
        try:
            player_data.append({
                "id": player_id,
                "name": f"{player_info.FIRST_NAME} {player_info.LAST_NAME}",
                "position": player_info.POSITION,
                "team": f"{player_info.TEAM_CITY} {player_info.TEAM_NAME}" if pd.notnull(team_id) else "Free Agent",
                "height": str(player_info.HEIGHT).replace("-", "'") if pd.notnull(player_info.HEIGHT) else "Unknown",
                "weight": int(player_info.WEIGHT) if pd.notnull(player_info.WEIGHT) else "Unknown",
                "birthDate": player_info.BIRTHDATE,
                "jersey": player_info.JERSEY,
                "conference": conference,
                "division": division,
                "age": convert_birthdate_to_age(player_info.BIRTHDATE),
                "league": "NBA"
            })
        except Exception as e:
            print(f"Error processing {player['full_name']}: {str(e)}")
            continue
        time.sleep(1.1)

    try:
        batch = db.batch()
        col_ref = db.collection(u"nba_players")
        
        docs = col_ref.stream()
        for doc in docs:
            batch.delete(doc.reference)
        
        for player in player_data:
            doc_ref = col_ref.document(str(player["id"]))
            batch.set(doc_ref, player)
        
        batch.commit()
        print("Database update completed successfully")
    except Exception as e:
        print(f"Firestore update failed: {str(e)}")

if __name__ == "__main__":
    main()