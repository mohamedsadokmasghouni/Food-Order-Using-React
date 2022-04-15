import { useReducer,useState, useRef, useContext} from 'react';
import CartContext from '../../store/cart-context';
import Modal from "../UI/Modal";
import classes from './CheckOut.module.css';

const CheckOut = (props) => {

  const cartCtx = useContext(CartContext);

  const checkFormValidity = (state, action) =>{
    return {
      name: action.name,
      phnbr: action.phnbr,
      address: action.address
    }
  }

  const [formIsValid, dispatch] = useReducer(checkFormValidity, {name: true, phnbr: true, address: true});

  const [error, setError] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  // const [formIsValid, setFormIsValid] = useState({
  //   name: true,
  //   phnbr: true,
  //   address: true
  // });

  const nameValue = useRef();
  const phnbrValue = useRef();
  const addressValue = useRef();

  const isEmpty = (value) => {return value.trim().length === 0};

  const confirmHandler = (event) => {
    event.preventDefault();

    const entredName = nameValue.current.value;
    const entredphnbr = phnbrValue.current.value;
    const entredaddress = addressValue.current.value;

    const nameValidity = !isEmpty(entredName);
    const phnbrValidity = !isEmpty(entredphnbr);
    const addressValidity = !isEmpty(entredaddress);

    dispatch({name: nameValidity, phnbr: phnbrValidity, address: addressValidity})

    // setFormIsValid({
    //   name: nameValidity,
    //   phnbr: phnbrValidity,
    //   address: addressValidity
    // })

    if(!(nameValidity && phnbrValidity && addressValidity)){
      return;
    }    

    const fetchHandler = async() => {

    const userData = {name: entredName,phnbr: entredphnbr, address: entredaddress};

    setIsSubmiting(true);
    await fetch('https://react-custom-hooks-2b364-default-rtdb.europe-west1.firebasedatabase.app/orders.json', {
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        order: cartCtx.items
      })
    });
    setIsSubmiting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  }
  fetchHandler().catch(err => {
    setIsSubmiting(false);
    setError(err.message);
  })
  };

  const closeHandler = () =>{
    props.onClose();
    setDidSubmit(false);
  }

  const container = <form className={classes.form} onSubmit={confirmHandler}>
  <div className={`${classes.control} ${!formIsValid.name && classes.invalid}`}>
    <label htmlFor="name">Your Name</label>
    <input id="name" ref={nameValue}/>
  </div>
  <div className={`${classes.control} ${!formIsValid.phnbr && classes.invalid}`}>
    <label htmlFor="phnbr">Your Phone Number</label>
    <input id="phnbr" ref={phnbrValue}/>
  </div>
  <div className={`${classes.control} ${!formIsValid.address && classes.invalid}`}>
    <label htmlFor="address">Your Address</label>
    <input id="address" ref={addressValue}/>
  </div>
  <div className={classes.actions}>
    <button onClick={props.onClose}>Close</button>
    <button type="submit" className={classes.submit}>Confirm</button>
  </div>
</form>

  const successSubmit = <div className={classes.actions}>
    <p>Your order have been submited succesfully!!</p>
    <button onClick={closeHandler}>Close</button>
  </div>

const errorMsg = <div className={classes.actions}>
<p>{error}</p>
<button onClick={props.onClose} className={classes.submit}>Close</button>
</div>

  return(
    <Modal onClose={closeHandler}>
      {!isSubmiting && !error && !didSubmit && container}
      {isSubmiting && <p>we are submiting your order please wait...</p>}
      {error && errorMsg}
      {didSubmit && successSubmit}
    </Modal>
  )
}

export default CheckOut;