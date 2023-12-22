import React, { useRef } from 'react'
import Child from './Child';

const Parent = () => {
    const child1Ref = useRef(null)
    const data=useRef("first")
    const callChildFunction = () => {
        // Access the childFunction through the ref
        if (child1Ref.current) {
          child1Ref.current.child1();
        }
        // if(data.current){
        //     data.current("second");
        // }
      };
  return (
    <div>
      <p>This is Parent1 component</p>
      <Child ref={child1Ref} />
      <button onClick={callChildFunction}>Call Child Function {data.current}</button>
    </div>
  )
}

export default Parent
