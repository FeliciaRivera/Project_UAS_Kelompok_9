/* AdminTabButton — satu tombol tab. Klik → props.onSelect(id tab). */

function AdminTabButton(props) {
  function handleClick() {
    props.onSelect(props.tab.id);
  }

  return (
    <li className="nav-item">
      <button
        type="button"
        className={"nav-link text-nowrap" + (props.active ? " active" : "")}
        aria-current={props.active ? "page" : undefined}
        onClick={handleClick}
      >
        {props.tab.label}
      </button>
    </li>
  );
}

export default AdminTabButton;
