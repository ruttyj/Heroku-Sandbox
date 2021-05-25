import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const HelloComponent = () => {
  const [isMounted, setMounted] = useState<boolean>(false);
  

  const initialFormState = {
    title: "",
    body: "",
  };
  const [formState, setFormState] = useState(initialFormState);
  const [listState, setListState] = useState([]);



  const handleOnChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    setFormState({
      ...formState,
      [name]: value
    });
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    const payload = {
      title: formState.title,
      body: formState.body,
    }

    axios({
      url: '/api/save',
      method: 'POST',
      data: payload,
    })
      .then(() => {
        console.log('data has been sent to the server');
        setFormState({...initialFormState});
        getBlogPost();
      })
      .catch(() => {
        console.log('internal server error');
      });
  }

  const getBlogPost = () => {
    axios.get('/api/list')
      .then((res) => {
        const payload = res.data;
        const data = payload.data;
        setListState(data)
      })
      .catch(() => {
        console.log('error fetching list');
      })
  }


  useEffect(() => {
    if (!isMounted) {
      getBlogPost();
      // Set as mounted
      setMounted(true);
    }
  }, [isMounted]);

  return (<div>
    <h1>Hello World!</h1>
    <form>
      <div className={"form-input"}>
        <input 
          type="text" 
          name="title" 
          placeholder="title" 
          value={formState.title} 
          onChange={handleOnChange}
        />
      </div>
      
      <div className={"form-input"}>
        <textarea 
          name="body" 
          placeholder="body" 
          value={formState.body}
          onChange={handleOnChange}
        />
      </div>
      <div>
        {JSON.stringify(formState, null, 2)}
      </div>
      <div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </form>

    <div>
      <pre>{JSON.stringify(listState, null, 2)}</pre>
    </div>
    
  </div>);
}


const App = () => {
  return (
    <div>
        <HelloComponent />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));