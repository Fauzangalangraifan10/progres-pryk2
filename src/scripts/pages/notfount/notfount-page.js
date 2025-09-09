const NotFountPage = {
  async render() {
    return `
      <section class="not-fount animate-fade-in">
        <div class="not-fount-content">
          <h2 class="title">404 - Halaman Tidak Ditemukan</h2>
          <p class="subtitle">Alamat yang Anda tuju tidak tersedia.</p>
          <a href="#/" class="back-home">⬅ Kembali ke Beranda</a>
        </div>
      </section>
    `;
  },

  async afterRender() {
    console.log('Halaman 404 Not Fount ditampilkan');
  },
};

export default NotFountPage;
