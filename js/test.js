//var FibonacciHeap = require('@tyriar/fibonacci-heap';

// Construct FibonacciHeap
var heap = new FibonacciHeap();
// Insert keys only
heap.insert(3);
heap.insert(7);
// Insert keys and values
heap.insert(8, {foo: 'bar'});
heap.insert(1, {foo: 'baz'});

// Extract all nodes in order
while (!heap.isEmpty()) {
  var node = heap.extractMinimum();
  console.log('key: ' + node.key + ', value: ' + node.value);
}
// > key: 1, value: [object Object]
// > key: 3, value: undefined
// > key: 7, value: undefined
// > key: 8, value: [object Object]

// Construct custom compare FibonacciHeap
heap = new FibonacciHeap(function (a, b) {
  return (a.key + a.value).localeCompare(b.key + b.value);
});
heap.insert('2', 'B');
heap.insert('1', 'a');
heap.insert('1', 'A');
heap.insert('2', 'b');

// Extract all nodes in order
while (!heap.isEmpty()) {
  var node = heap.extractMinimum();
  console.log('key: ' + node.key + ', value: ' + node.value);
}