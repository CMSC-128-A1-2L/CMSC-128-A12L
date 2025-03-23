"use client";
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function SignUp() {

    const [formInput, setInput] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [formError, setError] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInput = (name: any, value: any) => {
        setInput({
            ...formInput,
            [name]: value
        });
    }

    const validateInput = (event: any) => {
        event.preventDefault();

        let formError = {
            email: "",
            password: "",
            confirmPassword: ""
        }

        if (!formInput.email.match("[a-z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,}$") && formInput.password !== formInput.confirmPassword) {
            setError({
                ...formError,
                email: "Enter valid email address",
                confirmPassword: "Password and confirm password should match"
            })
            return
        }

        if (!formInput.email.match("[a-z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,}$")) {
            setError({
                ...formError,
                email: "Enter valid email address"
            })
            return
        }

        if (formInput.password !== formInput.confirmPassword) {
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
        <div className="h-screen flex items-center justify-center" style={{
            backgroundImage: "url('/assets/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
            <div className="card w-110" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                <div className="card-body items-center">
                    <h2 className="text-info-content text-xl md:text-2xl font-extrabold" style={{ fontFamily: "Montserrat, sans-serif" }}>Create Alumni Account</h2>
                    <form onSubmit={validateInput}>
                        <div className="card-body">
                            <div className="join mb-2 gap-2 w-84">
                                <input type="text" className="input" placeholder="First Name" required />
                                <input type="text" className="input" placeholder="Last Name" required />
                            </div>

                            <input type="text" onChange={({ target }) => { handleInput(target.name, target.value) }} name="email" className="input mb-2 w-84" placeholder="Email" required />
                            {formError.email && <span className="mb-3 text-sm text-red-400">{formError.email}</span>}

                            <input value={formInput.password} onChange={({ target }) => { handleInput(target.name, target.value) }} name="password" type="password" className="input mb-2 w-84" placeholder="Password" required />

                            <input value={formInput.confirmPassword} onChange={({ target }) => { handleInput(target.name, target.value) }} name="confirmPassword" type="password" className="input mb-2 w-84" placeholder="Confirm Password" required />
                            {formError.confirmPassword && <span className="text-sm text-red-400">{formError.confirmPassword}</span>}

                        </div>
                        <div className="card-actions justify-center">
                            <button className="btn btn-wide bg-[#0C0051] text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Sign Up</button>
                        </div>
                    </form>
                </div>
                <button onClick={() => redirect("/login")} className="btn bg-[#0C0051] text-white btn-block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer" }}>Cancel</button>
            </div>
        </div>
    );
}
