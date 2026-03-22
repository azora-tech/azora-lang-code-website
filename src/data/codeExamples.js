export const codeExamples = [
  {
    title: 'Hello World',
    code: `func main() {
    println("Hello, world!")
}`,
  },
  {
    title: 'Variables',
    code: `func main() {
    // Mutable binding
    var count = 0

    // Immutable binding
    fin name = "Azora"
    fin greeting = "Hello, \${name}!"

    // Type inference works on arrays too
    fin items = [1, 2, 3, 4, 5]
    count = items.length

    println(greeting)
    println("\${count}")
}`,
  },
  {
    title: 'Functions & Lambdas',
    code: `// Named function with return type
func add(a: Int, b: Int): Int {
    return a + b
}

// Single-expression function
func square(x: Int): Int = x * x

// Higher-order function
func apply(value: Int, transform: (Int) -> Int): Int {
    return transform(value)
}

func main() {
    println("\${add(3, 4)}")
    println("\${square(5)}")

    // Lambda
    fin double = { x -> x * 2 }
    println("\${apply(5, double)}")
}`,
  },
  {
    title: 'Tuples',
    code: `func divmod(a: Int, b: Int): (Int, Int) {
    return (a / b, a % b)
}

func main() {
    // Tuple literal
    fin pair = (42, "hello")
    println("\${pair.0}")
    println(pair.1)

    // Tuple as return value
    fin result = divmod(17, 5)
    println("quotient: \${result.0}")
    println("remainder: \${result.1}")

    // Nested tuple
    fin nested = (1, (2, 3), "end")
    fin inner = nested.1
    println("\${inner.0}")
}`,
  },
  {
    title: 'Packs & Enums',
    code: `pack Point {
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

    fin dir = Direction.North
    println("\${dir}")
}`,
  },
  {
    title: 'Slots',
    code: `slot Shape {
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
    fin r = Shape.Rectangle(3.0, 4.0)

    println(describe(c))
    println(describe(r))
}`,
  },
  {
    title: 'Inheritance',
    code: `node Animal(var name: String) {
    func speak(): String {
        return "..."
    }
}

node Dog(var breed: String, var name: String) : Animal(name) {
    repl func speak(): String {
        return "Woof! I'm \${this.name}"
    }
}

node Cat(var name: String) : Animal(name) {
    repl func speak(): String {
        return "Meow!"
    }
}

func main() {
    fin dog = Dog(breed: "Labrador", name: "Rex")
    fin cat = Cat("Whiskers")

    println(dog.speak())
    println(cat.speak())
    println(dog.breed)
}`,
  },
  {
    title: 'Generics',
    code: `pack Pair<A, B> {
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
    code: `func main() {
    fin a = async {
        suspend 100
        "Hello, Alice!"
    }
    fin b = async {
        suspend 100
        "Hello, Bob!"
    }

    // Await both results
    println(await a())
    println(await b())
}`,
  },
  {
    title: 'Flows',
    code: `flow range(n: Int): Int {
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
    code: `func factorial(n: Int): Int {
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
    code: `fail MathError {
    DivisionByZero
    Overflow
}

func safeDivide(a: Int, b: Int): Int!MathError {
    if b == 0 { throw .DivisionByZero }
    return a / b
}

func main() {
    // Catch with default value
    fin result = safeDivide(10, 0) catch -1
    println("10 / 0 = \${result}")

    // Successful division
    fin ok = safeDivide(10, 2) catch 0
    println("10 / 2 = \${ok}")
}`,
  },
  {
    title: 'Contracts',
    code: `func clamp(x: Int, lo: Int, hi: Int): Int
in {
    assert lo <= hi { "lo must be <= hi" }
}
out { r ->
    assert r >= lo { "result must be >= lo" }
    assert r <= hi { "result must be <= hi" }
}
scope {
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
    code: `func main() {
    // Array
    fin numbers = [1, 2, 3, 4, 5]
    println("Array length: \${numbers.length}")

    // Set literal (deduplicates)
    fin unique = ![1, 2, 2, 3, 3, 3]
    println("Set length: \${unique.length}")

    // Map literal
    fin scores = ["alice": 95, "bob": 87, "carol": 92]
    println("Map length: \${scores.length}")

    // Empty map
    fin empty = [:]
    println("Empty map: \${empty.length}")
}`,
  },
  {
    title: 'Metaprogramming',
    code: `deco Range {
    min: Int
    max: Int
}

deco Serializable

@Serializable
@Range(min = 0, max = 100)
fin health: Int = 50

// Compile-time introspection using deepinline
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
    code: `pack Node {
    var value: Int
    var next: Node* = null
}

func main() {
    // Heap allocation
    var a = alloc Node(value: 1, next: null)
    var b = alloc Node(value: 2, next: null)
    var c = alloc Node(value: 3, next: null)

    // Link nodes: a -> b -> c
    (*a).next = b
    (*b).next = c

    // Traverse the linked list
    var current: Node* = a
    while current != null {
        println((*current).value)
        current = (*current).next
    }

    // Cleanup
    drop c
    drop b
    drop a
}`,
  },
  {
    title: 'Dependency Injection',
    code: `// Singleton services with solo
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

// DI container wiring
wrap AppModule {
    solo Logger
    solo Database
}

func main() {
    // Start the DI container lifecycle
    AppModule.initLifecycle()

    // Resolve singletons from the active wrap
    fin logger = inject Logger
    fin db = inject Database

    logger.log("Starting app")
    db.connect()
    fin result = db.query("SELECT * FROM users")
    logger.log(result)

    // End lifecycle, runs solo destructors
    AppModule.endLifecycle()
}`,
  },
  {
    title: 'Reactivity',
    code: `// Persistent state with rem
func counter() {
    rem count: Int = 0
    count = count + 1
    println("Call #\${count}")
}

// Reactive views
view Greeting(name: String) {
    rem visits: Int = 0
    visits = visits + 1

    println("Hello, \${name}!")
    println("Visited \${visits} times")

    // Side effects that track dependencies
    effect name {
        println("Name changed to: \${name}")
    }
}

func main() {
    // rem persists across calls
    counter()   // Call #1
    counter()   // Call #2
    counter()   // Call #3
}`,
  },
]
