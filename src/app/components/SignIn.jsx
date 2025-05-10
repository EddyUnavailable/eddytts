import { SignIn } from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>My App</h1>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}

export default App;