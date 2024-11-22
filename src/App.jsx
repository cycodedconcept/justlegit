import Display from './Display'
import { CartProvider } from '../src/pages/CartContext'

function App() {

  return (
    <>
    <CartProvider>
      <Display />
    </CartProvider>
    </>
  )
}

export default App
