import ReactDOM from 'react-dom';
import { ConnectionStateProvider } from './app/lib/state/connectionContext';
import HomePage from './app/lib/components/pages/Home';

const App = () => {
  return (
    <ConnectionStateProvider>
      <HomePage />
    </ConnectionStateProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));