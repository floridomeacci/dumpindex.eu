import random, json, subprocess, time

cities = [
    'Naples', 'Amsterdam', 'Marseille', 'Athens', 'Rome', 'Bucharest',
    'Paris', 'Palermo', 'Brussels', 'Sofia', 'Barcelona', 'Belgrade',
    'Istanbul', 'Catania', 'Lisbon', 'Manchester', 'Thessaloniki',
    'Charleroi', 'Berlin', 'Madrid', 'Lviv', 'Tirana', 'Skopje',
    'Dublin', 'Warsaw', 'Bratislava'
]

weights = [30, 25, 22, 18, 16, 14, 13, 12, 11, 10, 9, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 1]

votes = []
for _ in range(200):
    city = random.choices(cities, weights=weights, k=1)[0]
    n = random.randint(1000, 99999)
    email = f'user{n}@dump.eu'
    votes.append((email, city))

print(f'Sending {len(votes)} votes...')
for i, (email, city) in enumerate(votes):
    payload = json.dumps({'email': email, 'city': city})
    result = subprocess.run(
        ['curl', '-sL', '-X', 'POST', '-H', 'Content-Type: application/json',
         '-d', payload, 'https://n8nfjm.org/webhook/dumpscore'],
        capture_output=True, text=True, timeout=10
    )
    if result.returncode != 0:
        print(f'  Error on {i+1}: {result.stderr.strip()}')
    if (i + 1) % 25 == 0:
        print(f'  {i+1}/200 sent')
    time.sleep(0.5)

print('Done!')
