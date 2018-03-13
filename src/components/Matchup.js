import React from 'react';

export default function Matchup({ selectedBatter, selectedPitcher, showPitch, showBat, batterColor, pitcherColor }) {
    var b = selectedBatter.player;
    var p = selectedPitcher.player;
    if (batterColor.colors) var batterPrimary = batterColor.colors.primary;
    if (pitcherColor.colors) var pitcherPrimary = pitcherColor.colors.primary;
    if (batterColor.colors) var batterSecondary = batterColor.colors.secondary;
    if (pitcherColor.colors) var pitcherSecondary = pitcherColor.colors.secondary;
    var batterBorder = {
      border: '5px solid ' + `${batterSecondary}`,
      'background-color': batterPrimary,
      color: 'white',
    };
    var pitcherBorder = {
      border: '5px solid ' + `${pitcherSecondary}`,
      'background-color': pitcherPrimary,
      color: 'white',
    }
    var batterSecondaryBorder = {
      border: '3px solid ' + `${batterSecondary}`,
    }
    var pitcherSecondaryBorder = {
      border: '3px solid ' + `${pitcherSecondary}`,
    }
    
    return (
      <div id='matchup-box'>
        <div id='batter' className={(showBat) ? '' : 'hidden'} style={batterBorder}>
          <div>
            <img src={(b.officialImageSrc) ? b.officialImageSrc : ''} id='batter-pic' style={batterSecondaryBorder}/>
          </div>
            <div id='batter-info'>
              <h2 id='batter-name'>{b.FirstName} {b.LastName}</h2>
            <h3 id='batter-team'>{(selectedBatter.team) ? selectedBatter.team.City : 'MLB/'} {(selectedBatter.team) ? selectedBatter.team.Name : 'FA'}</h3>
              <h3 id='batter-position'>Position: {(b.Position) ? b.Position : ''} Side: {(b.handedness) ? b.handedness.Bats : ''}</h3>
              <h3 id='batter-age-height-weight'>Age:{(b.Age) ? b.Age : ''}  Height:{(b.Height) ? b.Height : ''} Weight:{(b.Weight) ? b.Weight : ''}</h3>
            <h3 id='batter-hometown'>Born: {(b.BirthCity) ? b.BirthCity : ''}, {(b.BirthCountry) ? b.BirthCountry : ''}</h3>
            </div>
        </div>
        <div id='pitcher' className={(showPitch)? '' : 'hidden'} style={pitcherBorder}>
          <div>
            <img src={(p.officialImageSrc) ? p.officialImageSrc : ''} id='pitcher-pic' style={pitcherSecondaryBorder}/>
          </div>
          <div id='pitcher-info'>
            <h2 id='pitcher-name'>{p.FirstName} {p.LastName}</h2>
            <h3 id='pitcher-team'>{(selectedPitcher.team) ? selectedPitcher.team.City : ''} {(selectedPitcher.team) ? selectedPitcher.team.Name : ''}</h3>
            <h3 id='pitcher-position'>Position:{(p.Position) ? p.Position : ''}  Side:{(p.handedness) ? p.handedness.Throws : ''}</h3>
            <h3 id='pitcher-age-height-weight'>Age: {(p.Age) ? p.Age : ''} Height: {(p.Height) ? p.Height : ''} Weight: {(p.Weight) ? p.Weight : ''}</h3>
            <h3 id='pitcher-hometown'>Born: {(p.BirthCity) ? p.BirthCity : ''}, {(p.BirthCountry) ? p.BirthCountry : ''}</h3>
          </div>
        </div>
      </div>
    );

};
