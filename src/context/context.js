import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';



const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  const [requests, setRequests] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ show: false, msg: "" })

  let searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    let response = await axios(`${rootUrl}/users/${user}`).catch((err) => {
      console.log(err)
    })

    if (response) {
      setGithubUser(response.data)
      let { login, followers_url } = response.data

      //get repos
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((values)=>{
      //   console.log(values)
      //   setRepos(values.data)
      // })
      // //get followers
      // axios(`${followers_url}?per_page=100`).then((values)=>{
      //   setFollowers(values.data)
      // })

      await Promise.allSettled([axios(`${rootUrl}/users/${login}/repos?per_page=100`), axios(`${followers_url}?per_page=100`)]).then((data) => {
        let [repos, followers] = data
        let status = 'fulfilled'
        if (repos.status === status) {
          setRepos(repos.value.data)
        }
        if (followers.status === status) {
          setFollowers(followers.value.data)
        }
      }).catch(err => console.log(err))


    } else {
      toggleError(true, "Sorry, the username does not exist")
    }
    checkRequests()
    setIsLoading(false)
  }

  let checkRequests = () => {
    axios(`${rootUrl}/rate_limit`).then(({ data }) => {

      let { rate: { remaining } } = data
      // console.log(remaining)
      // remaining = 0
      setRequests(remaining)
      if (remaining === 0) {
        toggleError(true, "Sorry, You have used your hourly limit")
      }
    }).catch(err => {

    })
  }

  function toggleError(show = false, msg = '') {
    setError({ show, msg })
  }

  useEffect(checkRequests, [])

  return <GithubContext.Provider value={{ githubUser, repos, followers, requests, error, searchGithubUser, isLoading }}>
    {children}
  </GithubContext.Provider>
}

export { GithubContext, GithubProvider }
