export const codeExamples = [
  {
    title: 'Hello World',
    code: `package playground

func main() {
    println("Hello, world!")
}`,
  },
  {
    title: 'Variables',
    code: `package playground

func main() {
    var count = 0

    fin name = "Azora"
    fin greeting = "Hello, \${name}!"

    fin items = arr[1, 2, 3, 4, 5]
    count = items.length

    println(greeting)
    println("\${count}")
}`,
  },
  {
    title: 'Functions & Lambdas',
    code: `package playground

func add(a: Int, b: Int) {
    return a + b
}

inline func square(x: Int) {
    return x * x
}

func apply(value: Int, transform: (Int) -> Int) {
    return transform(value)
}

inline func inlineApply(value: Int, transform: (Int) -> Int) {
    return transform(value)
}

func main() {
    println("\${add(3, 4)}")
    println("\${inline add(2, 6)}")
    println("\${square(5)}")

    var x = inline add(3, 4)
    var y = square(9)

    fin double = { x -> x * 2 }
    println("\${apply(5, double)}")

    inline fin inlineDouble = { x -> x * 2 }
    println("\${inlineApply(6, inlineDouble)}")
}`,
  },
  {
    title: 'Tuples',
    code: `package playground

func divmod(a: Int, b: Int) {
    return tup(a / b, a % b)
}

func main() {
    fin pair = tup(42, "hello")
    println("\${pair.0}")
    println(pair.1)

    fin result = divmod(17, 5)
    println("quotient: \${result.0}")
    println("remainder: \${result.1}")

    fin nested = tup(1, tup(2, 3), "end")
    fin inner = nested.1
    println("\${inner.0}")
}`,
  },
  {
    title: 'Packs & Enums',
    code: `package playground

pack Point {
    var x: Real
    var y: Real
}

enum Direction {
    North
    South
    East
    West
}

func main() {
    fin p = Point(3.0, 4.0)
    fin origin = Point(0.0, 0.0)

    fin dx = p.x - origin.x
    fin dy = p.y - origin.y
    println("Distance squared: \${dx * dx + dy * dy}")

    fin dir1 = Direction.North
    fin dir2: Direction = .North
    println("\${dir1}")
    println("\${dir2}")
}`,
  },
  {
    title: 'Slots',
    code: `package playground

slot Shape {
    Circle(radius: Real)
    Rectangle(width: Real, height: Real)
    Point
}

func describe(shape: Shape): String {
    return when shape {
        is .Circle -> "circle with r=\${shape.radius}"
        is .Rectangle -> "rect \${shape.width}x\${shape.height}"
        is .Point -> "point"
    }
}

func main() {
    fin c = Shape.Circle(5.0)
    fin r: Shape = .Rectangle(3.0, 4.0)

    println(describe(c))
    println(describe(r))
}`,
  },
  {
    title: 'Inheritance',
    code: `package playground

node Animal(var name: String) {
    virtual func eat(): String

    virtual func speak() {
        return "..."
    }
}

leaf Dog(var breed: String, var name: String) : Animal(name) {
    replace func eat() {
        return "Dog Food"
    }

    replace func speak() {
        return "Woof! I'm \${this.name}\${base.speak()}"
    }
}

leaf Cat(var name: String) : Animal(name) {
    replace func eat() {
        return "Cat Food"
    }

    replace func speak() {
        return "Meow!"
    }
}

func main() {
    fin dog = Dog(breed: "Labrador", name: "Rex")
    fin cat = Cat("Whiskers")

    println(dog.breed)
    println(cat.name)

    println(dog.speak())
    println(cat.speak())
    println((cat as Animal).speak())

    println(dog.eat())
    println(cat.eat())
}`,
  },
  {
    title: 'Generics',
    code: `package playground

pack Pair<A, B> {
    var first: A
    var second: B
}

func swap<A, B>(pair: Pair<A, B>): Pair<B, A> {
    return Pair(pair.second, pair.first)
}

func main() {
    fin p = Pair<String, Int>("hello", 42)
    println("\${p.first}, \${p.second}")

    fin s = swap<String, Int>(p)
    println("\${s.first}, \${s.second}")
}`,
  },
  {
    title: 'Async / Await',
    code: `package playground

task main() {
    fin a = async {
        suspend 1000
        "Hello, Alice!"
    }
    fin b = async {
        suspend 1000
        "Hello, Bob!"
    }

    println(await a())
    println(await b())
}`,
  },
  {
    title: 'Flows',
    code: `package playground

flow range(n: Int): Int {
    for i in 0..n {
        yield i
    }
}

flow evens(n: Int): Int {
    for i in 0..n {
        if i % 2 == 0 {
            yield i
        }
    }
}

task main() {
    var sum = 0
    async for x in range(5) {
        sum = sum + x
    }
    println("Sum 0..5: \${sum}")

    async for e in evens(10) {
        println("\${e}")
    }
}`,
  },
  {
    title: 'Testing',
    code: `package playground

func factorial(n: Int): Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)
}

test "factorial of 0 is 1" {
    assert factorial(0) == 1
}

test "factorial of 5 is 120" {
    assert factorial(5) == 120
}

test "factorial of 1 is 1" {
    assert factorial(1) == 1
}`,
  },
  {
    title: 'Error Handling',
    code: `package playground

fail MathError {
    DivisionByZero
    Overflow
}

func safeDivide(a: Int, b: Int): Int!MathError {
    if b == 0 { throw .DivisionByZero }
    return a / b
}

func main() {
    fin result = safeDivide(10, 0) catch -1
    println("10 / 0 = \${result}")

    fin ok = safeDivide(10, 2) catch 0
    println("10 / 2 = \${ok}")
}`,
  },
  {
    title: 'Contracts',
    code: `package playground

func clamp(x: Int, lo: Int, hi: Int): Int
in {
    assert lo <= hi { "lo must be <= hi" }
}
out { r ->
    assert r >= lo { "result must be >= lo" }
    assert r <= hi { "result must be <= hi" }
}
zone {
    if x < lo { return lo }
    if x > hi { return hi }
    return x
}

test "clamp within range" {
    assert clamp(5, 0, 10) == 5
}

test "clamp below minimum" {
    assert clamp(-5, 0, 10) == 0
}

test "clamp above maximum" {
    assert clamp(15, 0, 10) == 10
}`,
  },
  {
    title: 'Collection Literals',
    code: `package playground

func main() {
    fin numbers = arr[1, 2, 3, 4, 5]
    println("Array length: \${numbers.length}")

    var items = mut vec[10, 20, 30]
    println("Vec length: \${items.length}")

    fin unique = set[1, 2, 2, 3, 3, 3]
    println("Set length: \${unique.length}")

    fin scores = map["alice": 95, "bob": 87, "carol": 92]
    println("Map length: \${scores.length}")

    fin empty = map[]
    println("Empty map: \${empty.length}")
}`,
  },
  {
    title: 'Metaprogramming',
    code: `package playground

deco Range {
    min: Int
    max: Int
}

deco Serializable

@Serializable
@Range(min = 0, max = 100)
fin health: Int = 50

deepinline {
    if hasDeco(health, Serializable) {
        trace { "health is serializable" }
    }

    if hasDeco(health, Range) {
        fin minVal = getDeco(health, Range, min)
        fin maxVal = getDeco(health, Range, max)
        trace { "health range: \${$minVal}..\${$maxVal}" }
    }
}

func main() {
    println("Health: \${health}")
}`,
  },
  {
    title: 'Pointers & Memory',
    code: `package playground

pack Node {
    var value: Int
    var next: Node* = null
}

func main() {
    var a = heap Node(value: 1, next: null)
    var b = heap Node(value: 2, next: null)
    var c = heap Node(value: 3, next: null)

    (*a).next = b
    (*b).next = c

    var current: Node* = a
    while current != null {
        println((*current).value)
        current = (*current).next
    }

    drop c
    drop b
    drop a
}`,
  },
  {
    title: 'Dependency Injection',
    code: `package playground

solo Logger {
    var level: Int = 1

    func log(msg: String) {
        if level > 0 {
            println("[LOG] " + msg)
        }
    }
}

solo Database {
    var connected: Bool = false

    func connect() {
        connected = true
        println("Database connected")
    }

    func query(sql: String): String {
        if !connected { return "not connected" }
        return "result for: " + sql
    }
}

wrap AppModule {
    solo Logger
    solo Database
}

func main() {
    AppModule.initLifecycle()

    fin logger = inject Logger
    fin db = inject Database

    logger.log("Starting app")
    db.connect()
    fin result = db.query("SELECT * FROM users")
    logger.log(result)

    AppModule.endLifecycle()
}`,
  },
  {
    title: 'Reactivity',
    code: `package playground

func counter() {
    rem count: Int = 0
    count = count + 1
    println("Call #\${count}")
}

view Greeting(name: String) {
    rem visits: Int = 0
    visits = visits + 1

    println("Hello, \${name}!")
    println("Visited \${visits} times")

    effect name {
        println("Name changed to: \${name}")
    }
}

func main() {
    counter()
    counter()
    counter()
}`,
  },
]
