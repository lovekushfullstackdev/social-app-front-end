import React from 'react'

const Child = React.forwardRef((props, ref) => {

    const child1=()=>{
        console.log("child1");
    }

  // Make the childFunction accessible through the ref
  React.useImperativeHandle(ref, () => ({
    child1,
  }));


  return (
    <div>
      <p>This is Child1 component</p>
      {/* You can call childFunction directly in this component if needed */}
    </div>
  )
});

export default Child
