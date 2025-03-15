export default function SignUp() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="card bg-base-300 w-110">
                <div className="card-body items-center">
                    <h2 className="card-title">Create Alumni Account</h2>
                    <form>
                        <div className="card-body items-center"> 
                            <div className="join mb-2 gap-2 w-84">
                                <input type="text" className="input" placeholder="First Name" />
                                <input type="text" className="input" placeholder="Last Name" />
                            </div>
                            <input type="email" className="input mb-2 w-84" placeholder="Email" />
                            <input type="password" className="input mb-2 w-84" placeholder="Password" />
                            <input type="password" className="input mb-2 w-84" placeholder="Confirm Password" />
                        </div>
                        <div className="card-actions justify-center">
                            <button className="btn btn-wide btn-neutral-content">Sign Up</button>
                        </div>
                    </form>
                </div> 
                <button className="btn btn-neutral-content btn-block">Cancel</button>
            </div>
        </div>
    );
  }