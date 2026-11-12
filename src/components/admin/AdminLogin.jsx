/* AdminLogin — form login admin (controlled form).
   Nilai, pesan error, dan semua handler berasal dari AdminPage. */

function AdminLogin(props) {
  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-md-7 col-lg-5">
        <div className="panel mt-3">
          <h2 className="panel-title text-center">Login Admin</h2>
          <p className="small text-muted text-center">
            Halaman ini khusus pengelola warung. Pelanggan tidak perlu login.
          </p>

          {props.error && <div className="alert alert-danger py-2 small">{props.error}</div>}

          <form noValidate onSubmit={props.onSubmit}>
            <div className="mb-3">
              <label htmlFor="admin-username" className="form-label info-label">Username</label>
              <input
                id="admin-username" name="username" type="text" autoComplete="username"
                className="form-control" placeholder="Masukkan username"
                value={props.formData.username} onChange={props.onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="admin-password" className="form-label info-label">Password</label>
              <input
                id="admin-password" name="password" type="password" autoComplete="current-password"
                className="form-control" placeholder="Masukkan password"
                value={props.formData.password} onChange={props.onChange}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Masuk</button>
              <button type="button" className="btn btn-link" onClick={props.onBack}>
                ← Kembali ke website
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
