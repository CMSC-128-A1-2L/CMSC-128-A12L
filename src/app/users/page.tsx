import userData from "@/dummy_data/user.json";

export default function UsersManagement(){
   return(
    <div className="min-h-screen flex flex-col bg-white">
        <h1 className="px-6 py-4 text-3xl" style={{ fontFamily: "Montserrat, sans-serif" }}>User Management</h1>
        <div className="flex px-15 justify-end">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" className="block w-full p-2.5 ps-10 text-sm border border-gray-300 rounded-lg" placeholder="Search" />
        </div>
        <button className="btn ml-3" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Filters</button>
       
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
                    <tr>
                        <td>Lorem Ipsum</td>
                        <td>Lorem Ipsum</td>
                        <td><button className="mr-3 btn" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Promote</button>
                        <button className="btn" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Delete</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
   );
}