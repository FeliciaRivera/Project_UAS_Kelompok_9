/* AdminTabs — navigasi tab dashboard (Bootstrap nav-pills). */

import AdminTabButton from "./AdminTabButton.jsx";

function AdminTabs(props) {
  return (
    <ul className="nav nav-pills admin-tabs flex-nowrap overflow-auto gap-2">
      {props.tabs.map((tab) => (
        <AdminTabButton key={tab.id} tab={tab} active={props.aktif === tab.id} onSelect={props.onSelect} />
      ))}
    </ul>
  );
}

export default AdminTabs;
