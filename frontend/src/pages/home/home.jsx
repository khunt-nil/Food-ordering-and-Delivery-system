import React,{useState} from 'react'
import './home.css'
import { Header } from '../../component/header/header'
import { Exploremenu } from '../../component/exploremenu/exploremenu'
import FoodDisplay from '../../component/fooddisplay/fooddisplay'

export const Home = () => {

    const [category,setCategory] =useState("All");
  return (
    <div>
        <Header/>
        <Exploremenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category}  />
    </div>
  )
}
