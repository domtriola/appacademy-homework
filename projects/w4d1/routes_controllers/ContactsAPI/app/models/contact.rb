class Contact < ActiveRecord::Base
  validates :user_id, presence: true, uniqueness: { scope: :email }
  belongs_to :owner, foreign_key: :user_id, class_name: :User
  has_many :contact_shares
  has_many :shared_users, through: :contact_shares, source: :user
end
