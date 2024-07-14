/* eslint-disable no-unused-vars */
 export function Tabs({setActiveTab}:{setActiveTab:(val:string)=>void}){
     return <div>
    <div className=" mb-4 border-b border-gray-200 dark:border-gray-700">
<ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400" id="tabs-example" role="tablist">
    <li className="me-2" role="presentation">
        <button
            className="inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="profile-tab-example"
            type="button"
            role="tab"
            aria-controls="profile-example"
            aria-selected="false"
            onClick={()=>setActiveTab('problem')}
        >
            Submit
        </button>
    </li>
    <li className="me-2" role="presentation">
        <button
            className="inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="dashboard-tab-example"
            type="button"
            role="tab"
            aria-controls="dashboard-example"
            aria-selected="false"
            onClick={()=>setActiveTab('submissions')}
        >
            Submission
        </button>
    </li>
    
    <li className="me-2" role="presentation">
        <button
            className="inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
            id="settings-tab-example"
            type="button"
            role="tab"
            aria-controls="settings-example"
            aria-selected="false"
            onClick={()=>setActiveTab('editorial')}
        >
            
            Editorial
        </button>
    </li>
 
</ul>
</div>
</div>
 }