import React from 'react';

export default function SearchResults({results, confirmSearch}) {
  return (
    <div>
      {results.map(result=>{
        return (<div key={result.player.ID} className='search-result' onClick={confirmSearch} id={result.player.ID}><h4>{(result.player.JerseyNumber) ? result.player.JerseyNumber : '00'} /  {result.player.FirstName} {result.player.LastName} - {result.player.Position} - {(result.team) ? result.team.Name : 'MLB'}</h4></div>)
      })}
    </div>
  );

}