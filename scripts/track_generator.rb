#!/usr/bin/env ruby
require 'json'
require 'yaml'
require 'fileutils'

repo_root = File.expand_path(File.dirname(__FILE__) + '/..')
Dir.chdir(repo_root)

config_path = File.join('_config.yml')
baseurl = ''
if File.exist?(config_path)
  config = YAML.load_file(config_path)
  baseurl = config['baseurl'] || ''
  baseurl = '' if baseurl == '/'
end

tracks_dir = File.join('api', 'track_api')
output_path = File.join('_data', 'tracks.yml')

unless File.directory?(tracks_dir)
  warn "Tracks directory not found: #{tracks_dir}"
  exit 0
end

tracks = []

Dir.glob(File.join(tracks_dir, '*.json')).each do |track_file|
  begin
    track_data = JSON.parse(File.read(track_file))
    track_name = File.basename(track_file, '.json')

    tracks << {
      'name' => track_name,
      'title' => track_data.dig('track', 'trackTitle') || track_name.gsub('_', ' ').gsub(/(\w+)/) { |w| w.capitalize },
      'artist' => track_data.dig('track', 'artistName') || 'Unknown Artist',
      'url' => "#{baseurl}/api/track_api/#{File.basename(track_file)}",
      'data' => track_data
    }
  rescue => e
    warn "Failed to process track #{track_file}: #{e.message}"
  end
end

tracks.sort_by! { |t| [t['artist'].downcase, t['title'].downcase] }

new_content = tracks.to_yaml

FileUtils.mkdir_p(File.dirname(output_path))

if !File.exist?(output_path) || File.read(output_path) != new_content
  File.write(output_path, new_content)
  puts "Updated #{output_path}"
else
  puts "No changes to #{output_path}"
end
