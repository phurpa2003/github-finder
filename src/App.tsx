import { useState } from 'react'

interface GithubUser {
  login : string
  name : string
  avatar_url : string
  bio? : string
  followers : number
  following : number
  public_repos : number
  html_url : string
}

function App() {


const [userName, setUserName] = useState<string>('')
const [user, setUser] = useState<GithubUser | null>(null)
const [error, setError] = useState<string | null>(null)
const [loading, setLoading] = useState<boolean>(false)

//data fetching function
  const fetchUser = async (): Promise<void> =>{
    try{ if (!userName.trim()) {
      setError('Please enter a username')
      setLoading(false)
      setUser(null)
      return
    }
    setLoading(true)
    setError(null)
    const response= await fetch(`https://api.github.com/users/${userName}`,{
      headers: {
        authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
      }
    })
    if (!response.ok) {
    throw new Error('User not found')}
    const data = await response.json() 
    setUser(data)
    setLoading(false)
  }
    catch (error) { 
      setError('User not found')
      setLoading(false)
      setUser(null)
}

}
 


return(
  <div className="p-8 bg-gray-900 min-h-screen">
    <div className="max-w-lg mx-auto">
    <h1 className='text-3xl font-bold text-center mt-8 mb-6'>Github profile finder </h1>
    <div className='flex gap-4'> 
      <input 
        type="text" 
        placeholder = "Enter Github username"
        value = {userName}
        className='border-l-4 border-blue-500 w-full rounded-lg px-4 py-2 '
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={(e)=>{
          if(e.key === "Enter"){
            fetchUser()
          }}}
        />
        <button 
        className='bg-blue-500 rounded text-white px-4 py-2 ml-2 hover:bg-blue-600 transition-colors duration-300'
        onClick={fetchUser}
        >
          Search
        </button>
</div>
   
    {loading && <p>Loading...</p>}


    {error &&
      <p className='text-red-500'>{error}</p>
    }


    {user &&
      <div className="mt-4 p-4 bg-white rounded shadow flex flex-col items-center text-center gap-4">
        <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full" /> 
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p>{user.bio}</p>
        <div className='flex flex-start'>
          <p >Followers: {user.followers}  </p>
          <p>Following: {user.following}</p>
          <p>Repos: {user.public_repos}</p>
        </div>
        
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Profile</a>
    
      </div>
}
  </div>
  </div>
  )
}

export default App