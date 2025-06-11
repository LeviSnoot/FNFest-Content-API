require 'json'

module Jekyll
  class TrackGenerator < Generator
    def generate(site)
      
      return if ENV['JEKYLL_ENV'] == 'development'
      
      tracks_dir = File.join(site.source, 'api', 'track_api')
      return unless File.directory?(tracks_dir)
      
      tracks = []
      
      Dir.glob(File.join(tracks_dir, '*.json')).each do |track_file|
        begin
          track_data = JSON.parse(File.read(track_file))
          track_name = File.basename(track_file, '.json')
          
          baseurl = site.config['baseurl'] || ''
          baseurl = '' if baseurl == '/'
          
          tracks << {
            'name' => track_name,
            'title' => track_data.dig('track', 'trackTitle') || track_name.gsub('_', ' ').gsub(/(\w+)/) { |w| w.capitalize },
            'artist' => track_data.dig('track', 'artistName') || 'Unknown Artist',
            'url' => "#{baseurl}/api/track_api/#{File.basename(track_file)}",
            'data' => track_data
          }
        rescue => e
          Jekyll.logger.warn "Failed to process track #{track_file}: #{e.message}"
        end
      end
      
      
      tracks.sort_by! { |t| [t['artist'].downcase, t['title'].downcase] }
      
      
      new_content = tracks.to_yaml
      output_path = File.join(site.source, '_data', 'tracks.yml')
      
      
      if !File.exist?(output_path) || File.read(output_path) != new_content
        File.write(output_path, new_content)
      end
    end
  end
end
