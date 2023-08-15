import time, sys
import requests


import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import pandas as pd


def get_teams_data():
    r = requests.get("https://statsapi.web.nhl.com/api/v1/teams")
    return r.json()["teams"]

def get_team_ids(data = get_teams_data()):
    teamIds = []
    for team in data:
        teamIds.append(team["id"])
    return teamIds

def get_player_ids():
    
    team_ids = get_team_ids()
    print(team_ids)
    player_ids = []

    for team_id in team_ids:
        print("Getting players for team: " + str(team_id))
        r = requests.get("https://statsapi.web.nhl.com/api/v1/teams/" + str(team_id) + "/roster")
        roster = r.json()
        
        for player in roster["roster"]:
            player_ids.append(player["person"]["id"])

    print(player_ids)
    return player_ids

def get_player_details(player_id):
    r = requests.get("https://statsapi.web.nhl.com/api/v1/people/" + str(player_id))

    return r.json()["people"][0]

def get_team_division(team_id):
    r = requests.get("https://statsapi.web.nhl.com/api/v1/teams/" + str(team_id))
    return r.json()["teams"][0]["division"]["name"]

def get_team_conference(team_id):
    r = requests.get("https://statsapi.web.nhl.com/api/v1/teams/" + str(team_id))
    return r.json()["teams"][0]["conference"]["name"]

def convert_birthday_to_age(birthday):
    birthday = birthday.split("-")
    birth_year = int(birthday[0])
    birth_month = int(birthday[1])
    birth_day = int(birthday[2])

    today = pd.Timestamp.today()
    age = today.year - birth_year - ((today.month, today.day) < (birth_month, birth_day))
    return age

if __name__ == "__main__":
    player_ids = get_player_ids()
    players = []
    player_details = []
    for player_id in player_ids:
        print(player_id)
        player = get_player_details(player_id)
        details = {
            "id": player_id,
            "name": player["fullName"],
            "position": player["primaryPosition"]["name"],
            "jerseyNumber": player["primaryNumber"] if "primaryNumber" in player else "0",
            "Team": player["currentTeam"]["name"],
            "Confernce": get_team_conference(player["currentTeam"]["id"]),
            "Division": get_team_division(player["currentTeam"]["id"]),
            "height": player["height"],
            "weight": player["weight"],
            "birthDate": player["birthDate"],
            "nationality": player["nationality"],
            "age": convert_birthday_to_age(player["birthDate"])
        }
        players.append(details)

    # Use a service account
    cred = credentials.Certificate('serviceAccount.json')
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    for db_player in players:
        doc_ref = db.collection(u'nhl_players').document(str(db_player["id"]))
        doc_ref.set(db_player)
        print("Added player: " + db_player["name"])