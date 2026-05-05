export const ERROR_CODES = {
    AUTH: {
        NO_TOKEN: { code: 401, message: 'Akses ditolak: Token tidak ditemukan.' },
        INVALID_TOKEN: { code: 401, message: 'Sesi habis atau token tidak valid. Silakan login ulang.' },
        INVALID_CREDENTIALS: { code: 401, message: 'Email atau password salah.' },
        EMAIL_EXISTS: { code: 400, message: 'Email sudah terdaftar. Silakan gunakan email lain.' },
        INVALID_ROLE: { code: 401, message: 'Role tidak valid.' },
    },

    USER: {
        NOT_FOUND: { code: 404, message: 'Pengguna tidak ditemukan.' },
        HIERARCHY_ERROR: { code: 400, message: 'Kesalahan hierarki: Pengguna tidak bisa menjadi manager bagi dirinya sendiri.' },
        UPDATE_FAILED: { code: 400, message: 'Gagal memperbarui data pengguna.' },
        DELETE_FAILED: { code: 400, message: 'Gagal menghapus pengguna. Pastikan pengguna tidak memiliki bawahan aktif.' }
    },
    
    PERMISSION: {
        FORBIDDEN: { code: 403, message: 'Anda tidak memiliki izin untuk mengakses ini.' },
        NOT_OWNER: { code: 403, message: 'Anda hanya dapat mengubah data milik Anda sendiri.' },
        NOT_MANAGER: { code: 403, message: 'Hanya manager yang bersangkutan yang dapat melakukan tindakan ini.' }
    },

    SYSTEM: {
        INTERNAL_ERROR: { code: 500, message: 'Terjadi kesalahan pada server. Hubungi Admin IT.' },
        DB_CONNECTION: { code: 500, message: 'Gagal terhubung ke database.' },
        VALIDATION_ERROR: { code: 400, message: 'Input data tidak valid. Periksa kembali form Anda.' },
        UPLOAD_FAILED: { code: 500, message: 'Gagal mengunggah file ke server.' }
    },

    REIMBURSE: {
        NOT_FOUND: { code: 404, message: 'Data pengajuan reimburse tidak ditemukan.' },
        ALREADY_PROCESSED: { code: 400, message: 'Pengajuan reimburse sudah diproses sebelumnya.' },
        OWN_APPROVAL: { code: 400, message: 'Anda tidak dapat menyetujui pengajuan Anda sendiri.' }
    },
    
    PENALTY: {
        NOT_FOUND: { code: 404, message: 'Data penalti tidak ditemukan.' },
        INVALID_AMOUNT: { code: 400, message: 'Jumlah denda penalti harus lebih besar dari 0.' },
        CANT_PENALIZE_SELF: { code: 400, message: 'Anda tidak bisa memberikan penalti kepada diri sendiri.' },
        NOT_SUBORDINATE: { code: 403, message: 'Anda hanya bisa memberikan penalti kepada bawahan langsung Anda.' }
    },

    LEAVE: {
        NOT_FOUND: { code: 404, message: 'Data pengajuan cuti tidak ditemukan.' },
        ALREADY_PROCESSED: { code: 400, message: 'Pengajuan cuti sudah diproses.' },
        INVALID_DATE: { code: 400, message: 'Rentang tanggal tidak valid.' },
        PAST_DATE: { code: 400, message: 'Tidak bisa mengajukan cuti untuk tanggal yang sudah lewat.' }
    }
};