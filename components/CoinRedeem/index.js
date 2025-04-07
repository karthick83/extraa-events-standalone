'use client'
import { useState } from "react";

const CoinRedeem = ({ options, amount, toggeleCoin, items, toggleMsg, toggleNoti }) => {

    const [selectedCoins, setselectedCoins] = useState({ gold: false, silver: false, blue: false });
    const gold_coins = options?.filter((option) => option.name === 'extraa gold')?.[0];
    const silver_coins = options?.filter((option) => option.name === 'extraa silver')?.[0];
    const blue_coins = options?.filter((option) => option.name === 'extraa blue')?.[0];
    const deal = items?.length > 0 && items?.filter(item => item?.type === 1)
    const goodie = items?.length > 0 && items?.filter(item => item?.type === 4)
    const gift = items?.length > 0 && items?.filter(item => item?.__typename === 'gift_cards')

    // Function to calculate total amount
    function calculateTotalAmount(cards) {
        let totalAmount = 0;
        cards && cards?.forEach(card => {
            const price = parseFloat(card?.price || card.product_variants[0].sale_price);
            const quantity = card.quantity;
            totalAmount += price * quantity;
        });
        return totalAmount;
    }

    const total_gift_amt = calculateTotalAmount(gift)
    const total_deal_amt = calculateTotalAmount(deal)
    const total_goodie_amt = calculateTotalAmount(goodie)
    // console.log(total_gift_amt, 'hi', total_deal_amt, total_goodie_amt);

    const onGoldChecked = (e, balance, cost) => {
        if ((parseInt(total_gift_amt) <= (balance * cost))) {
            selectedCoins.gold = e.target.checked
        } else {
            toggleMsg("You don't have enough coins to buy gift cards with coins")
            toggleNoti(true)
            setTimeout(() => {
                toggleNoti(false)
            }, 5000)
            selectedCoins.gold = false
        }
        setselectedCoins({ ...selectedCoins })
        toggeleCoin({ ...selectedCoins })
    }

    const onSilverChecked = (e, balance, cost) => {
        if ((parseInt(total_deal_amt) <= (balance * cost))) {
            selectedCoins.silver = e.target.checked
        } else {
            toggleMsg("You don't have enough coins to buy deals with coins")
            toggleNoti(true)
            setTimeout(() => {
                toggleNoti(false)
            }, 5000)
            selectedCoins.silver = false
        }
        setselectedCoins({ ...selectedCoins })
        toggeleCoin({ ...selectedCoins })
    }

    const onBlueChecked = (e, balance, cost) => {
        if ((parseInt(total_goodie_amt) <= (balance * cost))) {
            selectedCoins.blue = e?.target?.checked
        } else {
            toggleMsg("You don't have enough coins to buy goodies with coins")
            toggleNoti(true)
            setTimeout(() => {
                toggleNoti(false)
            }, 5000)
            selectedCoins.blue = false
        }
        setselectedCoins({ ...selectedCoins })
        toggeleCoin({ ...selectedCoins })
    }

    return (
        <>
            <div className="flex flex-row flex-wrap gap-2 mt-4">
                {gold_coins && gold_coins?.wallets[0]?.balance && gold_coins?.wallets[0]?.balance > 0 && gift?.length > 0 ?
                    <label className={!gift ? "cursor-no-drop" : "cursor-pointer"}>
                        <div className="flex items-center border-[1px] border-[#F6AC00] rounded-lg gap-4 px-4 py-2">
                            <input type="checkbox" disabled={!gift} checked={selectedCoins?.gold} onChange={(e) => onGoldChecked(e, gold_coins?.wallets[0]?.balance, gold_coins?.cost)} className="checkbox border-[#F6AC00] checked:border-white [--chkbg:#F6AC00] [--chkfg:white]" />
                            <div>
                                <p className="text-xs text-[#1B1C1E] uc-sb" >{gold_coins?.name}</p>
                                <p className="text-sm text-[#C57600] uc-sb">{gold_coins?.wallets[0]?.balance>0 ? gold_coins?.wallets[0]?.balance:0} Coins</p>
                            </div>
                        </div>
                    </label>
                    : null
                }
                {silver_coins && silver_coins?.wallets[0]?.balance && silver_coins?.wallets[0]?.balance > 0 && deal?.length > 0 ?
                    <label className={!deal ? "cursor-no-drop" : "cursor-pointer"}>
                        <div className="flex items-center border-[1px] border-[#9C99FF] rounded-lg gap-4 px-4 py-2">
                            <input type="checkbox" disabled={!deal} checked={selectedCoins?.silver} onChange={(e) => onSilverChecked(e, silver_coins?.wallets[0]?.balance, silver_coins?.cost)} className="checkbox border-[#9C99FF] checked:border-white [--chkbg:#9C99FF] [--chkfg:white]" />
                            <div>
                                <p className="text-xs text-[#1B1C1E] uc-sb" >{silver_coins?.name}</p>
                                <p className="text-sm text-[#9C99FF] uc-sb">{silver_coins?.wallets[0]?.balance>0 ? silver_coins?.wallets[0]?.balance:0} Coins</p>
                            </div>
                        </div>
                    </label>:null
                }
                {blue_coins && blue_coins?.wallets[0]?.balance && blue_coins?.wallets[0]?.balance > 0 && goodie?.length > 0 ?
                   
                   <label className={!goodie ? "cursor-no-drop" : "cursor-pointer"}>
                        <div className="flex items-center border-[1px] border-[#6B21A8] rounded-lg gap-4 px-4 py-2">
                            <input type="checkbox" disabled={!goodie} checked={selectedCoins?.blue} onChange={(e) => onBlueChecked(e, blue_coins?.wallets[0]?.balance, blue_coins?.cost)} className="checkbox border-[#6B21A8] checked:border-white [--chkbg:#6B21A8] [--chkfg:white]" />
                            <div>
                                <p className="text-xs text-[#1B1C1E] uc-sb" >{blue_coins?.name}</p>
                                <p className="text-sm text-[#6B21A8] uc-sb">{blue_coins?.wallets[0]?.balance>0 ?blue_coins?.wallets[0]?.balance:0} Coins</p>
                            </div>
                        </div>
                    </label>:null
                }
            </div>
        </>

    )
}

export default CoinRedeem;