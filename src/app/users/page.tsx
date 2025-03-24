import userData from "@/dummy_data/user.json";
import { text } from "stream/consumers";

export default function UsersManagement(){

    const alumniUsers = userData.filter(user => user.role === "alumni");
   return(
    <div className="min-h-screen flex flex-col bg-white">
        <div className="navbar bg-[#0C0051] shadow-sm mb-4">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl">User Management</a>
        </div>
        <div className="flex-none">
        <button className="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"></path>
        </svg>
        </button>

        </div>
        </div>
        <div className="flex px-15 justify-end">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" className="block w-full p-2.5 ps-10 text-sm text-black border border-gray-300 rounded-lg" placeholder="Search" />
        </div>
        <button className="btn ml-3 bg-[#0C0051] text-white hover:bg-[#12006A]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Filters</button>
       
        </div>
        <div className="px-3 py-4">
            {/* displays users */}
            <table className="table text-center">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {alumniUsers.map((user, index) => 
                    
                    <tr key={index}>
                        <td className="text-black">{user.firstName} {user.lastName}</td>
                        <td> Email </td>
                        <td><button className="mr-3 btn bg-[#0C0051] text-white hover:bg-[#12006A]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Promote</button>
                        <button className="btn bg-[#0C0051] text-white hover:bg-[#12006A]" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Delete</button></td>
                    </tr>
                    )}
                </tbody>
            </table>
            {alumniUsers.length === 0 && <p className="text-center text-gray-500 mt-4">No Alumni Found</p>}
        </div>
    </div>
   );
}