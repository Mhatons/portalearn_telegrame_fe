import { useState } from "react";
import { FormInput } from "../../components/common/input";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useNavigate } from "react-router-dom";

interface IData {
    email: string,
    password: string
}

export default function Login() {
    const navigate = useNavigate()
    // label, onChange, name, type, placeholder, value, classNames
    const [err, setErr] = useState<string | null>();
    const [isLoading, setIsLoading] = useState<boolean | null>();
    const [userData, setUserData] = useState<IData>({ email: "", password: "" });

    console.log("userData", userData)

    // Handle input changes dynamically
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; // Get the input field's name and value
        setUserData((prevData) => ({
            ...prevData,
            [name]: value, // Update the field dynamically based on the 'name' attribute
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/admin/login`, userData);
            console.log("response", response)

            // Store the user data in localStorage as a string
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/admin'); 

            setIsLoading(false);
            console.log('Login successful:', response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setErr(error.response?.data?.message || 'An error occurred');
            } else {
                setErr('An unexpected error occurred');
            }
            setIsLoading(false);
            console.error('POST error:', error);
        }
    };

    return (
        <div className="flex items-center login_backgroundColor justify-center w-full h-screen ">
            <form onSubmit={(e) => e.preventDefault()} className="sm:border sm:border-green-400 w-[500px] login_backgroundColor rounded-2xl pb-16" action="#">
                <header className="text-[25px] text-white font-comfortaa pt-10 font-extrabold text-center">Authentication </header>
                <div className="w-[80%] m-auto">
                    <FormInput
                        onChange={handleChange}
                        name="email"
                        label="Email"
                        value={userData.email}
                        placeholder="Enter your email"
                    />
                    <FormInput
                        onChange={handleChange}
                        name="password"
                        label="Password"
                        value={userData.password}
                        placeholder="Enter your password"
                        type="password"
                    />
                    <button
                        onClick={handleSubmit}
                        className=" bg-button hover:bg-[#1d3e61] capitalize text-lg rounded-md mt-8 w-full text-white py-3 px-7 font-bold">
                        {!isLoading ? "login" : "processing..."}
                    </button>
                    <span className=" font-mono text-red-600">{err}</span>
                </div>
            </form>
        </div>
    )
}