import os
import yaml

API_DIR = 'api'
OUTPUT_FILE = '_data/files.yml'

def generate_link_tree(api_dir, output_file):
    file_list = []

    for root, dirs, files in os.walk(api_dir):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, api_dir)
                url_path = relative_path.replace(os.sep, '/')
                file_list.append({'name': url_path, 'url': f'{API_DIR}/{url_path}'})

    with open(output_file, 'w') as f:
        yaml.dump(file_list, f)

if __name__ == '__main__':
    generate_link_tree(API_DIR, OUTPUT_FILE)