const timeNoOptions = ['firstTurn', 'secondTurn', 'thirdTurn'] as const;

enum TimeNo {
 firstTurn = 1,
 secondTurn,
 thirdTurn,
}

export { timeNoOptions, TimeNo };
