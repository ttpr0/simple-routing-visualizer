package util

import (
	"container/heap"
)

type PriorityQueueItem[T any, P number] struct {
	value    T
	priority P
}

type PriorityQueue[T any, P number] []PriorityQueueItem[T, P]

func (self *PriorityQueue[T, P]) Len() int { return len(*self) }

func (self *PriorityQueue[T, P]) Less(i, j int) bool {
	return (*self)[i].priority < (*self)[j].priority
}

func (self *PriorityQueue[T, P]) Swap(i, j int) {
	(*self)[i], (*self)[j] = (*self)[j], (*self)[i]
}

func (self *PriorityQueue[T, P]) Push(x any) {
	item := x.(PriorityQueueItem[T, P])
	*self = append(*self, item)
}

func (self *PriorityQueue[T, P]) Pop() any {
	old := *self
	n := len(old)
	item := old[n-1]
	*self = old[0 : n-1]
	return item
}

func (self *PriorityQueue[T, P]) Update(item int, value T, priority P) {
	(*self)[item].value = value
	(*self)[item].priority = priority
	heap.Fix(self, item)
}

func (self *PriorityQueue[T, P]) Enqueue(value T, priority P) {
	heap.Push(self, PriorityQueueItem[T, P]{value: value, priority: priority})
}

func (self *PriorityQueue[T, P]) Dequeue() (T, bool) {
	if len(*self) == 0 {
		var result T
		return result, false
	}
	item := heap.Pop(self).(PriorityQueueItem[T, P])
	return item.value, true
}

func NewPriorityQueue[T any, P number](length int) PriorityQueue[T, P] {
	pq := make(PriorityQueue[T, P], 0, length)
	heap.Init(&pq)
	return pq
}