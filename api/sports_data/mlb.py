#!/usr/bin/env python3
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import statsapi

def main():
    schedule = statsapi.schedule(start_date="2025-07-01", end_date="2025-09-01")
    team_ids = set()
    for game in schedule:
        team_ids.add(game["home_id"])
        team_ids.add(game["away_id"])

    team_data = []
    for team_id in team_ids:
        resp = statsapi.get("team", {"teamId": team_id})
        for team in resp["teams"]:
            if "division" not in team or "league" not in team:
                continue
            team_data.append({
                "id": team["id"],
                "name": team["name"],
                "abbreviation": team["abbreviation"],
                "conference": team["league"]["name"], 
                "division": team["division"]["name"].strip().split(" ")[-1]
            })

    players_json = statsapi.get("sports_players", {"sportId": 1, "active": 1, "season": 2025})
    player_data = []
    for player in players_json["people"]:
        if (
            "primaryNumber" not in player or
            "currentTeam" not in player or
            "primaryPosition" not in player or
            "id" not in player["currentTeam"]
        ):
            continue

        p = {
            "id": str(player["id"]),
            "name": player["fullName"],
            "number": player["primaryNumber"],
            "age": player["currentAge"],
            "height": player["height"],
            "weight": player["weight"],
            "currentTeam": player["currentTeam"]["id"],
            "position": player["primaryPosition"]["abbreviation"],
            "league": "MLB"
        }

        for tm in team_data:
            if tm["id"] == p["currentTeam"]:
                p["conference"] = tm["conference"]
                p["division"]   = tm["division"]
                p["team"]       = tm["name"]
                break

        player_data.append(p)

    cred = credentials.Certificate(
        "/Users/lukewismer/Library/Mobile Documents/com~apple~CloudDocs/thepregames/api/sports_data/serviceAccount.json"
    )
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    new_ids = set()
    for pl in player_data:
        new_ids.add(pl["id"])
        db.collection("mlb_players").document(pl["id"]).set(pl)

    existing_docs = db.collection("mlb_players").stream()
    for doc in existing_docs:
        if doc.id not in new_ids:
            doc.reference.delete()

if __name__ == "__main__":
    main()
