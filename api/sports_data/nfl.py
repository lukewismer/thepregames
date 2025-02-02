#!/usr/bin/env python3
import requests
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

def birthdate_to_age(birthdate):
    y, m, d = map(int, birthdate.split("T")[0].split("-"))
    today = pd.Timestamp.today()
    return today.year - y - ((today.month, today.day) < (m, d))

def main():
    cred = credentials.Certificate("/Users/lukewismer/Library/Mobile Documents/com~apple~CloudDocs/thepregames/api/sports_data/serviceAccount.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    players = []
    page_index = 1
    url = f"https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes?limit=1000&page={page_index}"
    data = requests.get(url).json()

    while "items" in data and len(data["items"]) > 0:
        for p_link in data["items"]:
            player = requests.get(p_link["$ref"]).json()
            if (
                player.get("active") is True
                and player.get("status", {}).get("type") == "active"
                and "jersey" in player
                and "dateOfBirth" in player
                and "weight" in player
                and "displayHeight" in player
                and "position" in player
                and "fullName" in player
                and "team" in player
            ):
                team_data = requests.get(player["team"]["$ref"]).json()
                group_data = requests.get(team_data["groups"]["$ref"]).json()

                players.append({
                    "id": player["id"],
                    "name": player["fullName"],
                    "position": player["position"]["name"],
                    "height": player["displayHeight"],
                    "weight": player["weight"],
                    "number": player["jersey"],
                    "birthDate": player["dateOfBirth"],
                    "age": birthdate_to_age(player["dateOfBirth"]),
                    "team": team_data["displayName"],
                    "division": group_data["name"],
                    "conference": group_data["name"].split(" ")[0],
                    "league": "NFL"
                })

        page_index += 1
        next_url = f"https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/athletes?limit=1000&page={page_index}"
        data = requests.get(next_url).json()

    new_ids = set()
    for pl in players:
        new_ids.add(pl["id"])
        db.collection("nfl_players").document(pl["id"]).set(pl)

    existing_docs = db.collection("nfl_players").stream()
    for doc in existing_docs:
        if doc.id not in new_ids:
            doc.reference.delete()

if __name__ == "__main__":
    main()
