"use client";
import { useState } from 'react';

export default function SignUp() {

    const[formInput, setInput] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [formError, setError] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInput = (name, value) => {
        setInput({
            ...formInput,
            [name]: value
        });
    }

    const validateInput = (event) =>{
        event.preventDefault();

        let formError = {
            email: "",
            password: "",
            confirmPassword: ""
        }
        
        if (!formInput.email.match("[a-z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,}$") && formInput.password !== formInput.confirmPassword){
            setError({
                ...formError,
                email: "Enter valid email address",
                confirmPassword: "Password and confirm password should match"
            })
            return
        }

        if (!formInput.email.match("[a-z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,}$")){
            setError({
                ...formError,
                email: "Enter valid email address"
            })
            return
        }

        if (formInput.password !== formInput.confirmPassword){
            setError({
                ...formError,
                confirmPassword: "Password and confirm password should match"
            })
            return
        }

        setError(formError);
        setInput((prevState) => ({
            ...prevState
        }))
    }
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="card bg-base-300 w-110">
                <div className="card-body items-center">
                    <h2 className="card-title">Create Alumni Account</h2>
                    <form onSubmit={validateInput}>
                        <div className="card-body"> 
                            <div className="join mb-2 gap-2 w-84">
                                <input type="text" className="input" placeholder="First Name" required />
                                <input type="text" className="input" placeholder="Last Name" required />
                            </div>

                            <input type="text" onChange={({ target }) => {handleInput(target.name, target.value)}} name="email" className="input mb-2 w-84" placeholder="Email" required />
                            {formError.email && <span className="mb-3 text-sm text-red-400">{formError.email}</span>}

                            <input value={formInput.password} onChange={({ target }) => {handleInput(target.name, target.value)}} name="password" type="password" className="input mb-2 w-84" placeholder="Password" required />

                            <input value={formInput.confirmPassword} onChange={({ target }) => {handleInput(target.name, target.value)}} name="confirmPassword" type="password" className="input mb-2 w-84" placeholder="Confirm Password" required />
                            {formError.confirmPassword && <span className="text-sm text-red-400">{formError.confirmPassword}</span>}

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