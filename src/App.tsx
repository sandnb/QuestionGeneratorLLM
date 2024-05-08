// import { useState } from 'react'
import './App.css'
import React, { useState } from 'react';
function App() {
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAnswer("Thinking...")
    const response = await fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    console.log('Response from the server:', data);
    setAnswer(data.response);
  }

  // Function to update the state with the input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };



  return (
    <div className='bg-gradient-to-r from-black from-75% via-gray-950 via-15% to-gray-800 to-5%'>
      <div className='inline-block'>
        <h1 className='text-neutral-100 text-7xl hover:blur-xl text-center mt-64'>Ask a question</h1>
      </div>
      <form className='text-white' onSubmit={handleSubmit}>
        <input className='rounded-md outline outline-neutral-100 h-36 w-56' id="query" type="text" value={query} onChange={handleChange} />
        <button type="submit" className='px-6 rounded-md ring ring-blue-300 outline outline-amber-50 outline-offset-2 hover:ring-blue-950'>Query</button>
      </form>
      <div id="answer">{answer}</div>
    </div>
  );
};

export default App
