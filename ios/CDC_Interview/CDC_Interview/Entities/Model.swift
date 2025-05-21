import Foundation

enum Tag: String, Codable {
    case deposit = "deposit"
    case withdrawal = "withdrawal"
}

struct USDPrice: Codable {
    struct Price: Codable, Identifiable {
        let id: Int
        let name: String
        let usd: Decimal
        let tags: [Tag]
    }

    let data: [Price]
}

struct AllPrice: Codable {
    struct Price: Codable, Identifiable {
        struct PriceRecord: Codable {
            let usd: Decimal
            let eur: Decimal
        }
        
        let id: Int
        let name: String
        let price: PriceRecord
        let tags: [Tag]
    }

    let data: [Price]
}
