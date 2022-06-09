import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const { repos } = React.useContext(GithubContext)
  // console.log(repos)

  /*let languages = repos.map((obj) => obj.language).filter((value)=>value!==null)
  let labelAndValues = []
  let uniqueLanguages = [...new Set(languages)]
  function count(value,array){
    let countValue=0
    for(let i = 0;i<array.length;i++){
      if(value==array[i]){
        countValue+=1
      }
    }
    return {label:value,value:countValue}
  }
  uniqueLanguages.forEach((value)=>{
    labelAndValues.push(count(value, languages))
  })
  labelAndValues = labelAndValues.sort((a,b)=>b.value-a.value).slice(0,5)
  console.log(labelAndValues)
  let chartData = [
    ...labelAndValues
  ]*/

  // my way of extracting the data for the pie chat but due to this there is a perfomance issue in the app as it uses lot of for loops :(




  let repoLanguages = repos.filter((item) => item.language !== null).reduce((total, items) => {
    let { language, stargazers_count
    } = items
    if (!total[language]) {
      total[language] = {
        label: language, value: 1, stars: stargazers_count
      }
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value += 1,
        stars: total[language].stars + stargazers_count
      }
    }

    return total
  }, {})


  let mostUsed = Object.values(repoLanguages).sort((a, b) => b.value - a.value).slice(0, 5)
  // console.log(mostUsed)
  let pieData = [
    ...mostUsed
  ]

  let mostStars = Object.values(repoLanguages).sort((a, b) => b.stars - a.stars).slice(0, 5).
    map((item) => {
      return { ...item, value: item.stars }
    })

  let doughnutData = [
    ...mostStars
  ]

  let { stars, forks } = repos.reduce((total, item) => {
    let { stargazers_count, name, forks } = item

    total.stars[stargazers_count] = {
      label: name, value: stargazers_count
    }
    total.forks[forks] = {
      label: name, value: forks
    }
    return total
  }, {
    stars: {},
    forks: {}
  })

   stars = Object.values(stars).slice(-5).reverse()
   forks = Object.values(forks).slice(-5).reverse()

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        {/* <ExampleChart data={chartData}></ExampleChart> */}
        <Pie3D data={pieData}/>
        <Doughnut2D data={doughnutData}/>
        <Column3D data={stars} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  )
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
