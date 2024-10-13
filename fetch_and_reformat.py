import requests
import json
import os
from datetime import datetime, timezone

API_URL = 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/spark-tracks'
OUTPUT_DIR = 'api/track_api'
MAIN_FILE = 'api/fnfest_content_api.json'

def fetch_available_jam_tracks():
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        
        # Check the encoding of the response
        print(f"Response encoding: {response.encoding}")
        
        # Ensure the response is parsed as JSON
        data = response.json()

        if not isinstance(data, dict):
            print("Error: The fetched data is not a dictionary.")
            return None

        available_tracks = {k: v for k, v in data.items() if isinstance(v, dict) and v.get('track')}
        return available_tracks
    except requests.RequestException as e:
        print(f'Error fetching available jam tracks: {e}')
        return None
    except json.JSONDecodeError as e:
        print(f'Error decoding JSON: {e}')
        return None

def beautify_and_translate(data):
    key_mapping = {
        "tt": "trackTitle",
        "ry": "releaseYear",
        "dn": "duration",
        "sib": "iconBass",
        "sid": "iconDrum",
        "sig": "iconGuitar",
        "siv": "iconVocals",
        "ge": "genres",
        "mk": "key",
        "mm": "majorMinor",
        "ab": "albumName",
        "in": "intensities",
        "mt": "BPM",
        "an": "artistName",
        "ar": "ageRating",
        "au": "albumArtFilename",
        "isrc": "recordingCode",
        "su": "songUUID",
        "ti": "trackIndex",
        "tb": "thumbFilename"
    }

    intensity_mapping = {
        "pb": "proBass",
        "pd": "proDrums",
        "vl": "vocals",
        "pg": "proGuitar",
        "gr": "guitar",
        "ds": "drums",
        "ba": "bass"
    }

    keys_to_exclude = [
        "_title",
        "sn",
        "mu",
        "nu",
        "gt",
        "ld",
        "jc",
        "_noIndex",
        "_locale",
        "_templateName",
        "qi",
        "_type"
    ]

    for track_id, track_data in data.items():
        track_data['lastModified'] = track_data.get('lastModified', datetime.now(timezone.utc).isoformat())
        
        track = track_data['track']
        for old_key, new_key in key_mapping.items():
            if old_key in track:
                track[new_key] = track.pop(old_key)
        
        if 'intensities' in track:
            intensities = track['intensities']
            for old_key, new_key in intensity_mapping.items():
                if old_key in intensities:
                    intensities[new_key] = intensities.pop(old_key)

        # Format the 'ti' value
        if 'trackIndex' in track:
            track['trackIndex'] = track['trackIndex'].replace('SparksSong:sid_placeholder_', '')

        # Format the 'au' value
        if 'albumArtFilename' in track:
            track['albumArtFilename'] = os.path.basename(track['albumArtFilename'])

        # Format the 'tb' value
        if 'thumbFilename' in track:
            track['thumbFilename'] = os.path.basename(track['thumbFilename'])

        # Remove excluded keys
        for key in keys_to_exclude:
            if key in track_data:
                del track_data[key]
            if key in track:
                del track[key]
            if 'intensities' in track and key in track['intensities']:
                del track['intensities'][key]

    return data

def save_json_files(data):
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    with open(os.path.join(MAIN_FILE), 'w') as f:
        json.dump(data, f, indent=4)

    for track_id, track_data in data.items():
        with open(os.path.join(OUTPUT_DIR, f'{track_id}.json'), 'w') as f:
            json.dump(track_data, f, indent=4)

def main():
    data = fetch_available_jam_tracks()
    if data:
        beautified_data = beautify_and_translate(data)
        save_json_files(beautified_data)
        print(f"Data saved successfully in '{OUTPUT_DIR}' directory.")
    else:
        print("No data to process.")

if __name__ == '__main__':
    main()
