from nba_api.stats.static import players
from nba_api.stats.static import teams
from nba_api.stats.endpoints import commonplayerinfo, teaminfocommon
import pandas as pd 

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def convert_birthdate_to_age(birthdate):
    birthdate = birthdate.split("-")
    birth_year = int(birthdate[0])
    birth_month = int(birthdate[1])
    birth_day = int(birthdate[2].split("T")[0])

    today = pd.Timestamp.today()
    age = today.year - birth_year - ((today.month, today.day) < (birth_month, birth_day))
    return age


all_players = players.get_players()
active_player_ids = []

for player in all_players:
    if player["is_active"] == True:
        active_player_ids.append(player["id"])


player_data = []
for player_id in active_player_ids:
    print("Getting player: " + str(player_id))
    temp_data = commonplayerinfo.CommonPlayerInfo(player_id=player_id).get_data_frames()[0].to_dict()

    team_id = temp_data["TEAM_ID"][0]
    team_details = teaminfocommon.TeamInfoCommon(team_id=team_id).get_data_frames()[0].to_dict()
    if len(team_details["TEAM_CONFERENCE"]) != 0 :
        if team_details["TEAM_CONFERENCE"][0] == "East":
            team_details["TEAM_CONFERENCE"][0] = "Eastern"
        else:
            team_details["TEAM_CONFERENCE"][0] = "Western"

        
        temp_data["HEIGHT"][0] = temp_data["HEIGHT"][0].replace("-", "'")

        player_data.append({
            "id": player_id,
            "name": temp_data["FIRST_NAME"][0] + " " + temp_data["LAST_NAME"][0],
            "position": temp_data["POSITION"][0],
            "team": temp_data["TEAM_CITY"][0] + " " + temp_data["TEAM_NAME"][0],
            "height": temp_data["HEIGHT"][0],
            "weight": temp_data["WEIGHT"][0],
            "birthDate": temp_data["BIRTHDATE"][0],
            "jersey": temp_data["JERSEY"][0],
            "conference": team_details["TEAM_CONFERENCE"][0],
            "division": team_details["TEAM_DIVISION"][0],
            "age": convert_birthdate_to_age(temp_data["BIRTHDATE"][0])
        })


cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

docs = db.collection(u'nba_players').stream()
for doc in docs:
    doc.reference.delete()
    print("Deleted player: " + doc.to_dict()["name"] + " from the database")

for db_player in player_data:
    db.collection(u'nba_players').document(str(db_player["id"])).set(db_player)
    print("Added player: " + db_player["name"] + " to the database")
