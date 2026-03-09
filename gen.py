import hashlib
import os

ILOŚĆ_KODÓW = 900
PLIK_SQL = "kody.sql"
PLIK_DO_DRUKU = "kody_do_druku.txt"


def generate_code():
    random_bytes = os.urandom(32)
    sha = hashlib.sha256(random_bytes).hexdigest()
    return sha[:8]


def generate_codes(n):
    codes = set()
    while len(codes) < n:
        codes.add(generate_code())
    return list(codes)


def save_sql_file(codes):
    with open(PLIK_SQL, "w", encoding="utf-8") as f:
        for code in codes:
            query = f"INSERT INTO kody (code, used) VALUES ('{code}', 0);\n"
            f.write(query)


def save_print_file(codes):
    with open(PLIK_DO_DRUKU, "w", encoding="utf-8") as f:
        for i in range(0, len(codes), 4):
            row = codes[i:i+4]
            f.write("\t".join(row) + "\n")


if __name__ == "__main__":
    codes = generate_codes(ILOŚĆ_KODÓW)
    save_sql_file(codes)
    save_print_file(codes)
    print(f"Wygenerowano {ILOŚĆ_KODÓW} kodów.")