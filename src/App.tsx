import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Greeter } from './components/Greeter'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <h1>Greeter</h1>

      <ConnectButton />

      {isConnected && (
        <>
          <Greeter />
        </>
      )}
      
    </>
  )
}



