import React from "react";
import { Item, Friend } from "../types";

//totals are all done front-end

interface Props {
  items: Item[];
  friends: Friend[];
}

const Totals = ({ items, friends }: Props) => {
  // Compute totals per friend
  const totals: Record<string, number> = {};
  friends.forEach((friend) => (totals[friend.name] = 0));

  items.forEach((item) => {
    const numSharers = item.purchasedBy.length;
    if (numSharers === 0) return;

    const shareAmount = item.price / numSharers;
    item.purchasedBy.forEach((friendName) => {
      totals[friendName] += shareAmount;
    });
  });

  return (
    <div>
      <h2>Totals</h2>
      <ul>
        {Object.entries(totals).map(([friend, total]) => (
          <li key={friend}>
            {friend}: ${total.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Totals;