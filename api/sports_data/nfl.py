import requests
import pandas as pd
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

page_index = 1
r = requests.get(f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes?limit=1000&page={page_index}')

data = r.json()

cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def birthdate_to_age(birthdate):
    birthdate = birthdate.split("-")
    birth_year = int(birthdate[0])
    birth_month = int(birthdate[1])
    birth_day = int(birthdate[2].split("T")[0])

    today = pd.Timestamp.today()
    age = today.year - birth_year - ((today.month, today.day) < (birth_month, birth_day))
    return age

players = []
while "items" in data and len(data["items"]) != 0:
    print(f"-------  PAGE #{page_index} --------")
    for player_link in data["items"]:
        player = requests.get(player_link["$ref"]).json()
        if player["active"] == True and player["status"]["type"] == "active" and "jersey" in player and "dateOfBirth" in player and "weight" in player and "displayHeight" in player and "position" in player and "fullName" in player and "team" in player:
            print("Adding player: " + player["id"])
            team_link = player["team"]["$ref"]
            team_data = requests.get(team_link).json()
            team_name = team_data["displayName"]
            group_data = requests.get(team_data["groups"]["$ref"]).json()
            division_name = group_data["name"]
            conference_name = group_data["name"].split(" ")[0]

            temp_player = {
                "id": player["id"],
                "name": player["fullName"],
                "position": player["position"]["name"],
                "height": player["displayHeight"],
                "weight": player["weight"],
                "number": player["jersey"],
                "birthDate": player["dateOfBirth"],
                "age": birthdate_to_age(player["dateOfBirth"]),
                "team": team_name,
                "division": division_name,
                "conference": conference_name
            }
            db.collection("nfl_players").document(str(temp_player["id"])).set(temp_player)
            print("Added player: " + temp_player["name"] + " to the database")
            players.append(temp_player)

    page_index += 1
    r = requests.get(f'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes?limit=1000&page={page_index}')
    data = r.json()




for player in players:
    db.collection("nfl_players").document(str(player["id"])).set(player)
    print("Added player: " + player["name"] + " to the database")
    

