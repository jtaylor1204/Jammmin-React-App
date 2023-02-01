import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify  from '../../util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []      
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {      
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(removeTrack) {
    let filteredTrack = this.state.playlistTracks.filter(track =>  track.id !== removeTrack.id)
    this.setState({playlistTracks: filteredTrack});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
          playListName: 'New Playlist',
          playlistTracks: []
        });
    }) 
    const buttonTimeout = setTimeout(goBack, 2000);
    let saveButton = document.querySelector('.Playlist-save')
    saveButton.innerHTML="PLAYLIST ADDED TO SPOTIFY"; 
    saveButton.style.backgroundColor= "#38E54D";
    function goBack() {
      saveButton.innerHTML="SAVE TO SPOTIFY";
      saveButton.style.backgroundColor= "#6c41ec";
    }
  }

  

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }

  render() {
    return(
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onSearch={this.search} onAdd={this.addTrack} />
          <Playlist 
            playlistName={this.state.playListName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
          />
        </div>
      </div>
      <div className="footer">
      <footer>This app was coded by <a href="https://jaidataylor.tech">Jaida Taylor</a> and is <a href="https://github.com/jtaylor1204/Jammmin-React-Project">open-sourced.</a></footer>
</div>
    </div>
    
    )
  }
}


export default App;