import ReactDOM from 'react-dom';
import { ConnectionStateProvider } from './app/lib/state/connectionContext';
import { BufferedStateProvider } from './app/lib/state/bufferedContext';
import HomePage from './app/lib/components/pages/Home';

const App = () => {
  return (
    <ConnectionStateProvider>
      <BufferedStateProvider>
        <HomePage />
      </BufferedStateProvider>
    </ConnectionStateProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));