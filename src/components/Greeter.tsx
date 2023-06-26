import { useState, ChangeEventHandler } from 'react'
import {  useNetwork, 
          useContractRead, 
          usePrepareContractWrite, 
          useContractWrite, 
          useContractEvent 
        } from 'wagmi'
import { Address } from 'abitype'


let greeterABI = [
  {
    "inputs":[],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  
  {
    "anonymous":false,
    "inputs":[
      { "indexed":false,
        "internalType":"string",
        "name":"_old",
        "type":"string"},
      { "indexed":false,
        "internalType":"string",
        "name":"_new",
        "type":"string"}
      ],
    "name":"GreetingChange",
    "type":"event"
  },
    
  {
    "inputs":[],"name":
    "greet",
    "outputs":[
      {"internalType":"string","name":"","type":"string"}
    ],
    "stateMutability":"view",
    "type":"function"
  },
  
  {"inputs":[
      {"internalType":"string","name":"_greeting","type":"string"}
    ],
    "name":"setGreeting",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
] as const   // greeterABI

type AddressPerBlockchainType = {
  [key: number]: Address
}


type ShowObjectAttrsType = {
  name: string,
  object: any
}


type ShowGreetingAttrsType = {
  greeting: string | undefined
}


const contractAddrs : AddressPerBlockchainType = {
  // OP Goerli
  420: '0x51dac29fe2da340f03ec4e4c9e3724c153314d1f',

  // Goerli
  5: '0x7fafb175325910034af262b609cc16706526c878'
}

const Greeter = () => {  
  const { chain } = useNetwork()

  const greeterAddr = chain ? contractAddrs[chain.id] : undefined

  const readResults = useContractRead({
    address: greeterAddr,
    abi: greeterABI,
    functionName: "greet"
    // No arguments
  })

  const [ currentGreeting, setCurrentGreeting ] = 
    useState(readResults.data)
  const [ newGreeting, setNewGreeting ] = useState("")

  const greetingChange : ChangeEventHandler<HTMLInputElement> = (evt) => 
    setNewGreeting(evt.target.value)

  const preparedTx = usePrepareContractWrite({
    address: greeterAddr,
    abi: greeterABI,
    functionName: 'setGreeting',
    args: [ newGreeting ]
  })

  const workingTx = useContractWrite(preparedTx.config)

  const unwatch = useContractEvent({
    address: greeterAddr,
    abi: greeterABI,
    eventName: "GreetingChange",
    listener: log => {
      console.log("Inside event listener")
         console.log(log[0].args["_new"])      
      setCurrentGreeting(log[0].args["_new"])
    }
  })

  return (
    <>
      <h2>Greeter</h2>
      {
        !readResults.isError && !readResults.isLoading &&
          <ShowGreeting greeting={currentGreeting} />
      }
      <hr />

      <input type="text" 
        value={newGreeting}
        onChange={greetingChange}
      />

      <button disabled={!workingTx.write}
              onClick={() => workingTx.write?.()}
      >
        Update greeting
      </button>
      <hr />
      <ShowObject name="readResults" object={readResults} />
      <ShowObject name="preparedTx" object={preparedTx} />
      <ShowObject name="workingTx" object={workingTx} />
    </>
  )
}


const ShowGreeting = (attrs : ShowGreetingAttrsType) => {
  return <>
    <b>{attrs.greeting}</b>
  </>
}


const ShowObject = (attrs: ShowObjectAttrsType ) => {
  const keys = Object.keys(attrs.object)
  const funs = keys.filter(k => typeof attrs.object[k] == "function")
  return <>  
    <details>
      <summary>{attrs.name}</summary>
      <pre>
        {JSON.stringify(attrs.object, null, 2)}
      </pre>
      { funs.length > 0 &&
        <>
          Functions:
          <ul>
          {funs.map((f, i) => 
           (<li key={i}>{f}</li>)
                )}
          </ul>
        </>
      }
    </details>
  </>
}


export {Greeter}
