import os
import yaml

API_DIR = 'api'
OUTPUT_FILE = '_data/files.yml'

def generate_link_tree(api_dir, output_file):
    file_list = []

    print(f"Walking through {api_dir} directory...")
    for root, dirs, files in os.walk(api_dir):
        print(f"Current directory: {root}")
        for file in files:
            print(f"Found file: {file}")
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, api_dir)
                url_path = relative_path.replace(os.sep, '/')
                file_list.append({'name': url_path, 'url': f'{API_DIR}/{url_path}'})
                print(f"Added file to list: {url_path}")

    # Sort the file list alphabetically by the 'name' key
    file_list = sorted(file_list, key=lambda x: x['name'])
    print("Sorted file list alphabetically.")

    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    print(f"Output directory ensured: {os.path.dirname(output_file)}")

    with open(output_file, 'w') as f:
        yaml.dump(file_list, f)
        print(f"Written {len(file_list)} entries to {output_file}")

if __name__ == '__main__':
    generate_link_tree(API_DIR, OUTPUT_FILE)