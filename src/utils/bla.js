// function numOffices(grid) {
//   let result = 0;
//   //Put your code here.
//   let markIsland = function(grid, x, y, visited) {
//     if (x < 0 || x > grid.length - 1 || y < 0 || y > grid[x].length - 1) {
//       return;
//     }
//     if (visited[x][y] === true) {
//       return;
//     }
//     visited[x][y] = true;
//     if (grid[x][y] === '0') {
//       return;
//     }
//     markIsland(grid, x - 1, y, visited);
//     markIsland(grid, x + 1, y, visited);
//     markIsland(grid, x, y - 1, visited);
//     markIsland(grid, x, y + 1, visited);
//   };

//   let visited = [];
//   for (let i = 0; i < grid.length; i++) {
//     visited[i] = [];
//   }
//   for (let x = 0; x < grid.length; x++) {
//     for (let y = 0; y < grid[x].length; y++) {
//       if (!visited[x][y] && grid[x][y] === '1') {
//         result++;
//         markIsland(grid, x, y, visited);
//       }
//       visited[x][y] = true;
//     }
//   }
//   return result;
// }

// console.log(
//   numOffices([
//     [1, 1, 0, 0, 0],
//     [1, 1, 0, 0, 0],
//     [0, 0, 1, 0, 0],
//     [0, 0, 0, 1, 1],
//   ]),
// );

function minimumConcat(initial, goal) {
  let result;
  let x = goal.split(initial);
  const arrayGoal = goal.split('');
  console.log(arrayGoal);
  if (x.length === 1) {
    for (let char of initial) {
      if (!arrayGoal.includes(char)) {
        result = -1;
      } else {
        console.log(arrayGoal);
        let x = arrayGoal.concat(
          ...arrayGoal.map((v, i) =>
            arrayGoal.slice(i + 1).map(w => v + ' ' + w),
          ),
        );
        console.log({ x });
      }
    }
  }
  return result;
}
console.log(minimumConcat('xyz', 'xzyxz'));
// function substrings(input) {
//   const result = [];
//   if (input.length === 1) {
//     result.push(input.split(''));
//   } else {
//     //iterate j, ja, jav, jav
//     for (let i = 0; i < input.length - 1; i++) {
//       let root = input.slice(0, i + 1);
//       let leaf = input.slice(i + 1);
//       for (char of leaf) {
//         let current = [];
//         current.push(root);
//         current.push(char);
//         result.push(current);
//       }
//     }
//     //adds the whole string as one of the leaves (ie. java, ava, va, a)
//     result.push(input.split(''));
//   }
//   return result;
// }
// console.log(substrings('xzyxz'));

function substrings(str, out) {
  let output = [];
  if (str.length === 0) {
    return out;
  }
  for (let i = 0; i < str.length; i++) {
    out.push(str.slice(0, i + 1));

    output.push(out);

    console.log(output);
    substrings(str.slice(i + 1), out);
    out.pop();
  }

  return output;
}

// main function
// 	public static void main(String[] args)
// 	{
// 		// input String
// 		String str = "ABCD";

// 		// output vector to store non-overlapping substrings
// 		List<String> out = new ArrayList<>();

// 		// Print all non-overlapping substrings
// 		recur(str, out);
// 	}
// }

console.log(substrings('java', []));
