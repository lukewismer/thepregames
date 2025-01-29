#!/usr/bin/env python3
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

def get_teams_data():
    return requests.get("https://api.nhle.com/stats/rest/en/team").json()["data"]

def get_team_ids():
    return [team["triCode"] for team in get_teams_data()]

def get_players():
    team_ids = get_team_ids()
    all_players = []
    for team_id in team_ids:
        try:
            r = requests.get(f"https://api-web.nhle.com/v1/roster/{team_id}/current")
            r.raise_for_status()
        except:
            continue
        roster = r.json()
        data = roster["forwards"] + roster["defensemen"] + roster["goalies"]
        for p in data:
            all_players.append({
                "id": p["id"],
                "name": p["firstName"]["default"] + " " + p["lastName"]["default"],
                "position": p["positionCode"],
                "team": team_id,
                "jerseyNumber": p["sweaterNumber"],
                "height": p["heightInInches"],
                "weight": p["weightInPounds"],
                "birthDate": p["birthDate"]
            })
    return all_players

def get_team_info():
    return requests.get("https://api-web.nhle.com/v1/standings/now").json()["standings"]

def get_team_conf_div_name(info, team_id):
    for t in info:
        if t["teamAbbrev"]["default"] == team_id:
            return t["conferenceName"], t["divisionName"], t["teamName"]["default"]

def convert_birthday_to_age(birthday):
    y, m, d = map(int, birthday.split("-"))
    today = pd.Timestamp.today()
    return today.year - y - ((today.month, today.day) < (m, d))

def main():
    cred = credentials.Certificate("/Users/lukewismer/Library/Mobile Documents/com~apple~CloudDocs/thepregames/api/sports_data/serviceAccount.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    team_info = get_team_info()
    players = get_players()
    new_ids = set()

    for p in players:
        c, d, nm = get_team_conf_div_name(team_info, p["team"])
        p["age"] = convert_birthday_to_age(p["birthDate"])
        p["Division"] = d
        p["Conference"] = c
        p["Team"] = nm
        new_ids.add(str(p["id"]))
        db.collection("nhl_players").document(str(p["id"])).set(p)

    existing_docs = db.collection("nhl_players").stream()
    for doc in existing_docs:
        if doc.id not in new_ids:
            doc.reference.delete()

if __name__ == "__main__":
    main()
