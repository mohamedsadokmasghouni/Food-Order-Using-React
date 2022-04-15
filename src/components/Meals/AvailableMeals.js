import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';


const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);

  useEffect(() =>{
    const fetchMeals = async () => {
      setLoading(true);
      const response = await fetch("https://react-custom-hooks-2b364-default-rtdb.europe-west1.firebasedatabase.app/meals.json");
      if(!response.ok){
        throw new Error('Something went wrong!!');
      }
      const data = await response.json();
      let loadedMeals = [];

      for (const key in data){
        loadedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price,
        });
      }
      
        setMeals(loadedMeals);
        setLoading(false);
}
    fetchMeals().catch(err => {setError(err.message)
      setLoading(false);
    });
  }, [])

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let show = <Card> 
  <p>Please wait...</p>
  </Card>;

  if(error){
    show = <Card> 
    <p>{error}</p>
    </Card>
  }
  if(!loading && !error){
    show = <section className={classes.meals}>
    <Card>
      <ul>{mealsList}</ul>
    </Card>
  </section>
  }

  return (
    show
  );
};

export default AvailableMeals;